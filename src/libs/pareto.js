// Utilities for Pareto computations shared by controllers

// Validate and coerce threshold into [0,100]. Returns { valid, value, error }
export function validateThreshold (thresholdParam, defaultValue = 80) {
  if (typeof thresholdParam === 'undefined' || thresholdParam === null || thresholdParam === '') {
    return { valid: true, value: defaultValue }
  }
  const t = Number(thresholdParam)
  if (!Number.isFinite(t) || t < 0 || t > 100) {
    return { valid: false, error: 'Invalid threshold. Must be a number between 0 and 100' }
  }
  return { valid: true, value: t }
}

// Build base processed data: sorted by frequency desc, with percentages and cumulatives
export function computeParetoBase (problems) {
  const items = Array.isArray(problems) ? problems.slice() : []
  const totalFrequency = items.reduce((sum, p) => sum + (Number(p?.frequency) || 0), 0)

  let cumulativePercentage = 0
  let cumulativeFrequency = 0
  const processedData = items
    .slice()
    .sort((a, b) => (Number(b?.frequency) || 0) - (Number(a?.frequency) || 0))
    .map(p => {
      const frequency = Number(p?.frequency) || 0
      const percentage = totalFrequency > 0 ? (frequency / totalFrequency) * 100 : 0
      cumulativePercentage += percentage
      cumulativeFrequency += frequency
      return {
        category: p?.name,
        frequency,
        percentage,
        cumulativePercentage,
        cumulativeFrequency
      }
    })

  return { processedData, totalFrequency, totalCategories: items.length }
}

// Mark items as critical including the first item that pushes over the threshold
export function markCritical (processedData, threshold) {
  const thresholdIndex = processedData.findIndex(item => item.cumulativePercentage > threshold)
  const criticalEndIndex = thresholdIndex === -1 ? processedData.length - 1 : thresholdIndex
  return processedData.map((item, index) => ({
    ...item,
    isCritical: index <= criticalEndIndex
  }))
}

// Mark items as golden up to and including the threshold (<= threshold)
// Deprecated: markGoldenUpToThreshold removed in favor of using isCritical consistently
