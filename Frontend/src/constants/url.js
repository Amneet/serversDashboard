const fqdn = `http://${window.location.hostname}:5010`;

export const getAllNames = `${fqdn}/names/all`
export const addNewName = `${fqdn}/names/add`

export const getAllServers = `${fqdn}/servers/all`;
export const getAllUsedServers = `${fqdn}/servers/all/used`;
export const getAllComments = `${fqdn}/comments/all`;

export const addServer = `${fqdn}/servers/add`;
export const removeServer = `${fqdn}/servers/remove`;

export const addComment = `${fqdn}/comments/add`;
export const removeComment = `${fqdn}/comments/remove`;