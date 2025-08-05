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
    console.log('Creating problem for project:', id)
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
