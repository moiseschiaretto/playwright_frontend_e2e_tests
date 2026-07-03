export function isMobileProject(projectName: string): boolean {
  return projectName === 'mobile';
}

export function isTabletProject(projectName: string): boolean {
  return projectName === 'tablet';
}

export function isCompactProject(projectName: string): boolean {
  return isMobileProject(projectName) || isTabletProject(projectName);
}
