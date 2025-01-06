// IPC channels
export const IPC_CHANNELS = {
  DEPENDENCY_STATUS: 'dependency-status',
  CHECK_DEPENDENCIES: 'check-dependencies',
  INSTALL_DEPENDENCY: 'install-dependency',
  FETCH_REGISTRY: 'fetch-registry',
  FETCH_SERVER_DETAIL: 'fetch-server-detail',
  FETCH_IMAGE: 'fetch-image',
  MCPM_INSTALL: 'mcpm::install',
  MCPM_LIST: 'mcpm::list',
  MCPM_REMOVE: 'mcpm::remove',
  MCPM_ENABLE: 'mcpm::enable',
  MCPM_DISABLE: 'mcpm::disable',
} as const
  