export enum RouteAccessType {
  inherit = 'inherit',
  unauthorized = 'unauthorized',
  anyAuthorized = 'anyAuthorized',
  hasAdminRole = 'hasAdminRole',
  hasUserRole = 'hasUserRole',
}

export enum RouteEntityType {
  roadmap = 'roadmapId',
  course = 'courseId',
}
