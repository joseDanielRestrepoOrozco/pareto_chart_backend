import Problem from '../models/problem.model.js'
import Project from '../models/project.model.js'
import userModel from '../models/user.model.js'

export const getAll = async (req, res, next) => {
  try {
    const projects = await Project.find().populate('user', 'name email')
    res.status(200).json(projects)
  } catch (error) {
    next(error)
  }
}

export const getProjectsByUser = async (req, res, next) => {
  const userId = req.user.id

  try {
    const projects = await Project.find({ user: userId }).select('-user -problems')
    res.status(200).json(projects)
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  const { name } = req.body
  const userId = req.user.id

  try {
    const newProject = new Project({
      name,
      user: userId
    })
    const savedProject = await newProject.save()
    res.status(201).json(savedProject)
  } catch (error) {
    next(error)
  }
}

export const getProjectById = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const project = await Project.findOne({ _id: id, user: userId }).populate('problems', 'name frequency')
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    res.status(200).json(project)
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  const id = req.params.id
  const { name } = req.body
  const userId = req.user.id

  try {
    const savedProject = await Project.findOneAndUpdate(
      { _id: id, user: userId },
      { name },
      { new: true, runValidators: true }
    )

    if (!savedProject) {
      return res.status(404).json({ error: 'Project not found' })
    }

    res.status(200).json(savedProject)
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  const id = req.params.id
  const user = req.user

  try {
    const project = await Project.findOne({ _id: id, user: user.id })

    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    await Project.findByIdAndDelete(id)

    await Problem.find({ project: id }).deleteMany()

    await userModel.findByIdAndUpdate(user.id, { $pull: { projects: id } })

    res.status(204).json({ message: 'Project deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const createProblem = async (req, res, next) => {
  const { id } = req.params
  const { name, frequency } = req.body

  try {
    const project = await Project.findOne({ _id: id, user: req.user.id })
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const newProblem = new Problem({
      name,
      frequency,
      project: project._id
    })

    const savedProblem = await newProblem.save()
    project.problems = project.problems.concat(savedProblem._id)
    await project.save()
    res.status(201).json(savedProblem)
  } catch (error) {
    next(error)
  }
}

export const deleteProblem = async (req, res) => {
  const { id, problemId } = req.params

  try {
    const project = await Project.findOne({ _id: id, user: req.user.id })
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    project.problems = project.problems.filter(p => p.toString() !== problemId)
    await project.save()

    await Problem.findByIdAndDelete(problemId)
    res.status(200).json({ message: 'Problem deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete problem' })
  }
}

export const updateProblem = async (req, res) => {
  const { id, problemId } = req.params
  const { name, frequency } = req.body

  try {
    const project = await Project.findOne({ _id: id, user: req.user.id })
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      problemId,
      { name, frequency },
      { new: true, runValidators: true }
    )

    if (!updatedProblem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    res.status(200).json(updatedProblem)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update problem' })
  }
}

export const getParetoAnalysis = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const thresholdParam = req.query.threshold

  let threshold = 80
  if (typeof thresholdParam !== 'undefined') {
    const t = Number(thresholdParam)
    if (!Number.isFinite(t) || t < 0 || t > 100) {
      return res.status(400).json({ error: 'Invalid threshold. Must be a number between 0 and 100' })
    }
    threshold = t
  }

  try {
    const project = await Project.findOne({ _id: id, user: userId }).populate('problems', 'name frequency')
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const problems = project.problems || []
    if (!problems.length) {
      return res.status(200).json({
        data: [],
        totalFrequency: 0,
        totalCategories: 0,
        topCause: 'N/A',
        principalCauses: [],
        threshold
      })
    }

    const totalFrequency = problems.reduce((sum, p) => sum + (p.frequency || 0), 0)
    let cumulativeSum = 0
    let cumulativeFrequency = 0

    const processedData = problems
      .slice()
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .map(problem => {
        const freq = Number(problem.frequency) || 0
        const percentage = totalFrequency > 0 ? (freq / totalFrequency) * 100 : 0
        cumulativeSum += percentage
        cumulativeFrequency += freq

        return {
          category: problem.name,
          frequency: freq,
          percentage,
          cumulative: cumulativeFrequency,
          cumulativePercentage: cumulativeSum,
          isCritical: false,
          isGolden: false
        }
      })

    const thresholdIndex = processedData.findIndex(item => item.cumulativePercentage > threshold)
    const criticalEndIndex = thresholdIndex === -1 ? processedData.length - 1 : thresholdIndex

    processedData.forEach((item, index) => {
      const isCritical = index <= criticalEndIndex
      item.isCritical = isCritical
      item.isGolden = isCritical
    })

    const principalCauses = processedData.filter(item => item.isCritical)
    const topCause = processedData[0]?.category || 'N/A'

    return res.status(200).json({
      data: processedData,
      totalFrequency,
      totalCategories: problems.length,
      topCause,
      principalCauses,
      threshold
    })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to compute Pareto analysis' })
  }
}

export const getParetoChartData = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  const thresholdParam = req.query.threshold

  let threshold = 80
  if (typeof thresholdParam !== 'undefined') {
    const t = Number(thresholdParam)
    if (!Number.isFinite(t) || t < 0 || t > 100) {
      return res.status(400).json({ error: 'Invalid threshold. Must be a number between 0 and 100' })
    }
    threshold = t
  }

  try {
    const project = await Project.findOne({ _id: id, user: userId }).populate('problems', 'name frequency')
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const problems = project.problems || []
    if (!problems.length) {
      return res.status(200).json([])
    }

    const totalFrequency = problems.reduce((sum, p) => sum + (p.frequency || 0), 0)
    let cumulativeSum = 0
    const processedData = problems
      .slice()
      .sort((a, b) => (b.frequency || 0) - (a.frequency || 0))
      .map(problem => {
        const freq = Number(problem.frequency) || 0
        const percentage = totalFrequency > 0 ? (freq / totalFrequency) * 100 : 0
        cumulativeSum += percentage
        return {
          category: problem.name,
          frequency: freq,
          percentage,
          cumulative: cumulativeSum,
          isGolden: false
        }
      })

    let running = 0
    processedData.forEach(item => {
      running += item.percentage
      if (running <= threshold || Math.abs(running - threshold) < 1e-9) {
        item.isGolden = true
      }
    })

    return res.status(200).json(processedData)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to compute Pareto chart data' })
  }
}
