export function isMobileProject(projectName: string): boolean {
  return projectName === 'mobile'; // Smartphone (360x800)
}

export function isTabletProject(projectName: string): boolean {
  return projectName === 'tablet'; // Tablet (768x1024)
}

export function isIphone17Project(projectName: string): boolean {
  return projectName === 'iphone17'; // iPhone 17 (402x874)
}

export function isCompactProject(projectName: string): boolean {
  return isMobileProject(projectName) || isTabletProject(projectName) || isIphone17Project(projectName);
}
