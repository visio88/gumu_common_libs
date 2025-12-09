const clientAllowedResources = [
  { method: 'GET', path: '/enums' },

  { method: 'GET', path: '/logout' },

  { method: 'PUT', path: '/password-reset/update-password' },

  { method: 'POST', path: '/team-member' },
  { method: 'POST', path: '/team-member/filter' },
  { method: 'PATCH', path: '/team-member/{teamMemberId}' },

  { method: 'GET', path: '/client' },
  { method: 'POST', path: '/client/filter' },
  { method: 'POST', path: '/client' },
  { method: 'GET', path: '/client/{clientId}' },
  { method: 'PATCH', path: '/client/{clientId}' },
  { method: 'DELETE', path: '/client/{clientId}' },
];

export default clientAllowedResources;
