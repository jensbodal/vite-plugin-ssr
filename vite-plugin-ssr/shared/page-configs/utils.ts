export { getConfigValue }
export { getCodeFilePath }
export { getPageConfig }

import { assert, assertUsage } from '../utils'
import type { ConfigName, PageConfig, PageConfigData } from './PageConfig'

function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'string'): null | string
function getConfigValue(pageConfig: PageConfigData, configName: ConfigName, type: 'boolean'): null | boolean
// function getConfigValue(pageConfig: PageConfigData, configName: ConfigName): unknown
function getConfigValue(
  pageConfig: PageConfigData,
  configName: ConfigName,
  type: 'string' | 'boolean'
): null | unknown {
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  const { configValue, configDefinedAt } = configElement
  assertUsage(
    typeof configValue === type,
    `${configDefinedAt} has an invalid type \`${typeof configValue}\`: is should be a ${type} instead`
  )
  return configValue
}

function getCodeFilePath(pageConfig: PageConfigData, configName: ConfigName): null | string {
  const configElement = pageConfig.configElements[configName]
  if (!configElement || isNullish(pageConfig, configName)) {
    return null
  }
  if (configElement.configValueFilePath !== null) {
    return configElement.configValueFilePath
  }
  const { configValue, configDefinedAt } = configElement
  assertUsage(
    typeof configValue === 'string',
    `${configDefinedAt} has an invalid type \`${typeof configValue}\`: it should be a \`string\` instead`
  )
  assertUsage(false, `${configDefinedAt} has an invalid value \`${configValue}\`: it should be a file path instead`)
}

function isNullish(pageConfig: PageConfigData, configName: ConfigName): boolean {
  const configElement = pageConfig.configElements[configName]
  if (!configElement) return true
  const { configValueFilePath, configValue } = configElement
  if (configValueFilePath) return false
  return configValue === null || configValue === undefined
}

function getPageConfig(pageId: string, pageConfigs: PageConfig[]): PageConfig {
  const pageConfig = pageConfigs.find((p) => p.pageId === pageId)
  assert(pageConfigs.length > 0)
  assert(pageConfig)
  return pageConfig
}
