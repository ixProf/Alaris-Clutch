'use strict';

// Per-user filter profiles.
// Optimized for a Junior .NET / ASP.NET Core backend developer.

const DOTNET_STACK = [
  'c#',
  'csharp',
  '.net',
  'dotnet',
  'asp.net',
  'aspnet',
  'asp.net core',
  'aspnet core',
  'web api',
  'rest api',
  'entity framework',
  'entity framework core',
  'ef core',
  'sql server',
  'postgresql',
  'postgres',
  'linq',
  'jwt',
  'redis',
  'signalr',
];

const PROFILES = {
  'egypt-junior': {
    experience: { min: 0, max: 2 },

    rejectSeniorTitles: true,
    rejectMidTitles: true,
    rejectTalentPools: true,

    titleScope: 'dotnet-backend',

    techAny: DOTNET_STACK,

    requireFullDescription: false,

    remoteOnly: false,

    requireEgyptOrRemote: true,

    maxAgeDays: 90,
  },

  standard: {
    experience: { min: 0, max: 2 },

    rejectSeniorTitles: true,
    rejectMidTitles: true,
    rejectTalentPools: true,

    titleScope: 'dotnet-backend',

    techAny: DOTNET_STACK,

    requireFullDescription: false,

    remoteOnly: false,

    requireEgyptOrRemote: true,
  },

  strict: {
    experience: { min: 0, max: 2 },

    rejectSeniorTitles: true,
    rejectMidTitles: true,
    rejectTalentPools: true,

    titleScope: 'dotnet-backend',

    techAny: DOTNET_STACK,

    requireFullDescription: true,

    remoteOnly: false,

    requireEgyptOrRemote: true,
  },

  'remote-strict': {
    experience: { min: 0, max: 2 },

    rejectSeniorTitles: true,
    rejectMidTitles: true,
    rejectTalentPools: true,

    titleScope: 'dotnet-backend',

    techAny: DOTNET_STACK,

    requireFullDescription: true,

    remoteOnly: true,

    requireEgyptOrRemote: true,
  },
};

const DEFAULT_PROFILE = 'egypt-junior';

function activeProfileName(argv = process.argv.slice(2)) {
  const i = argv.indexOf('--profile');

  if (i >= 0 && argv[i + 1]) {
    return argv[i + 1];
  }

  if (process.env.JOB_PROFILE) {
    return process.env.JOB_PROFILE;
  }

  return DEFAULT_PROFILE;
}

function getProfile(name, extra = {}) {
  const base = PROFILES[name];

  if (!base && !extra._custom) {
    throw new Error(
      `unknown profile "${name}" (available: ${Object.keys(PROFILES).join(', ')})`
    );
  }

  return {
    name,
    ...(base || PROFILES[DEFAULT_PROFILE]),
    ...extra,
  };
}

module.exports = {
  PROFILES,
  DEFAULT_PROFILE,
  getProfile,
  activeProfileName,
  DOTNET_STACK,
};