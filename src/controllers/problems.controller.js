import Project from '../models/project.model.js'
import Problem from '../models/problem.model.js'

export const createProblem = async (req, res, next) => {
  const { projectId } = req.params
  const { name, frequency } = req.body

  try {
    const project = await Project.findOne({ _id: projectId, user: req.user.id })
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const newProblem = new Problem({ name, frequency, project: project._id })

    const savedProblem = await newProblem.save()
    project.problems = project.problems.concat(savedProblem._id)
    await project.save()
    res.status(201).json(savedProblem)
  } catch (error) {
    next(error)
  }
}

export const deleteProblem = async (req, res, next) => {
  const { problemId } = req.params

  try {
    const problem = await Problem.findById(problemId)
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const project = await Project.findOne({ _id: problem.project.toString(), user: req.user.id })
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    project.problems = project.problems.filter(p => p.toString() !== problemId)
    await project.save()

    await Problem.findByIdAndDelete(problemId)
    res.status(200).json({ message: 'Problem deleted successfully' })
  } catch (error) {
    next(error)
  }
}

export const updateProblem = async (req, res, next) => {
  const { problemId } = req.params
  const { name, frequency } = req.body

  try {
    const problem = await Problem.findById(problemId)
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' })
    }

    const project = await Project.findOne({ _id: problem.project.toString(), user: req.user.id })
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
    next(error)
  }
}
