import type { ProjectType } from "../models/Project";
import type { TaskType } from "../models/Task";
import { TokenType } from "../models/Token";
import { UserType } from "../models/User";



declare global {
  namespace Express {
    interface Request {
      project?: ProjectType,
      task?: TaskType,
      tokenAuth?: TokenType,
      tokenPassword?: TokenType,
      user?: UserType
    }
  }
}