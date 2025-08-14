import Project from '../models/project.model.js'
import { validateThreshold, computeParetoBase, markCritical } from '../libs/pareto.js'

// Unified Pareto endpoint: returns data suitable for both analysis and chart in a single response
export const getAnalysis = async (req, res, next) => {
  const { projectId } = req.params
  const userId = req.user.id
  const thresholdParam = req.query.threshold ?? req.body?.threshold
  const v = validateThreshold(thresholdParam, 80)
  if (!v.valid) {
    return res.status(400).json({ error: v.error })
  }
  const threshold = v.value

  try {
    const project = await Project.findOne({ _id: projectId, user: userId }).populate('problems', 'name frequency')
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
        threshold
      })
    }

    const base = computeParetoBase(problems)
    const marked = markCritical(base.processedData, threshold)
    const topCause = marked[0]?.category || 'N/A'

    return res.status(200).json({
      data: marked,
      totalFrequency: base.totalFrequency,
      totalCategories: base.totalCategories,
      topCause,
      threshold
    })
  } catch (error) {
    next(error)
  }
}
