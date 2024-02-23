export const mockLoginService = {
  findOne: jest.fn(),
};

export const usrLogin = {
  email: 'judareiro@gmail.com',
  password: 'Anubis@1',
};

export const succesLogin = {
  user: {
    uid: '65d8459da53425574021dac0',
    role: 'superadmin',
    data: {
      displayName: 'judareiro',
      photoURL: '',
      email: 'judareiro@gmail.com',
      settings: {
        layout: {},
        theme: {},
      },
      shortcuts: ['app.mail', 'app.calendar'],
      loginRedirectUrl: '/dashboards/project',
    },
  },
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZDg0NTlkYTUzNDI1NTc0MDIxZGFjMCIsImVtYWlsIjoianVkYXJlaXJvQGdtYWlsLmNvbSIsImlhdCI6MTcwODY3NTAyOSwiZXhwIjoxNzA4NjgyMjI5fQ.MpVhHPkVZEsHY4Pp1HOf8kNMdHrSztTHUzm8fOY7Wgk',
};
