import funcPointSettings from './funcPointSettings'
import handbookSettings from './handbook'
/**
 * 这个map的key是jenkins构建上的region
 */
const REGION_MAP = {
  [`${__JENKINS_REGION__}`]: `${__JENKINS_REGION__}`,
  'zjxc': 'default',
  "undefined": 'default',
}
const r =  'zjxc' // `${__JENKINS_REGION__}`
export default {
  sysDicCode: REGION_MAP[r], // 项目地区配置字段
  // 根据地区和功能code码获取功能配置
  ...funcPointSettings,
  handbookSettings
}
