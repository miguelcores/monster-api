const allRoles = {
  user: [], // Any other Elixir Games Employee
  admin: ['createMonster', 'getMonsterGold'], // Bored Mike
  superAdmin: ['getUsers', 'manageUsers', 'manageMonsters'], // Elixir Games CEO
};

export const roles: string[] = Object.keys(allRoles);
export const roleRights: Map<string, string[]> = new Map(Object.entries(allRoles));
