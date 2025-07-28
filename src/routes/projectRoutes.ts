import {Router} from 'express'
import ProjectController from '../controller/ProjectController'
import TaskController from '../controller/TaskController'
import TeamController from '../controller/TeamController'
import { validationBodyProject, validationBodyTask, validationStatusTask, validateAnEmail, validationNote } from '../config/validation'
import {validationRequestBody} from '../middleware/validation'
import { projectExists } from '../middleware/project'
import { taskExists } from '../middleware/task'
import { aunthenticateJWT } from '../middleware/authentication'
import { authorized, unauthorized } from "../middleware/authorization";
import NoteController from '../controller/NoteController'


const router = Router()


router.use(aunthenticateJWT)
router.param('projectId', projectExists)
router.param('taskId', taskExists)


//Routes for Projects
router.get('/', 
  ProjectController.getAllProjects
)

router.get('/:projectId',
  authorized, 
  ProjectController.getProjectById
)

router.post('/', 
  validationBodyProject, 
  validationRequestBody, 
  ProjectController.createProject
)

router.put('/:projectId', 
  unauthorized,
  validationBodyProject, 
  validationRequestBody, 
  ProjectController.updateProject
)

router.delete('/:projectId', 
  unauthorized,
  ProjectController.deleteProject
)

//Routes for Task
router.get('/:projectId/tasks', 
  authorized,
  TaskController.getAllTaskFromProject
)

router.get('/:projectId/tasks/:taskId', 
  authorized,
  TaskController.getTaskById
)

router.post('/:projectId/tasks', 
  unauthorized,
  validationBodyTask, 
  validationRequestBody, 
  TaskController.createTask
)

router.put('/:projectId/tasks/:taskId', 
  unauthorized,
  validationBodyTask, 
  validationRequestBody, 
  TaskController.updateTask
)

router.patch('/:projectId/tasks/:taskId/status', 
  authorized,
  validationStatusTask,
  validationRequestBody,
  TaskController.updateStatus
)


router.delete('/:projectId/tasks/:taskId', 
  unauthorized,
  TaskController.deleteTask
)


//Routes for Team
router.post('/:projectId/team/find', 
  unauthorized,
  validateAnEmail,
  validationRequestBody,
  TeamController.findMemberById
)

router.post('/:projectId/team', 
  unauthorized,
  TeamController.addMemberById
)

router.delete('/:projectId/team/:memberId',
  unauthorized,
  TeamController.removeMemberById
)

router.get('/:projectId/team',
  unauthorized,
  TeamController.getProjecTeam
)


//Routes for Notes
router.post('/:projectId/tasks/:taskId/notes',
  authorized,
  validationNote,
  validationRequestBody,
  NoteController.createNote
)

router.delete('/:projectId/tasks/:taskId/notes/:noteId',
  authorized,
  NoteController.deleteNote
)


export default router