import { RequestHandler } from "express";
import Note from "../models/Note";
import { throwError } from "../helper/helpers";

export default class NoteController{

  static createNote : RequestHandler = async (req, res, next) => {
    const {content} = req.body
    const task = req.task!
    const note = new Note({
      content,
      createdBy: req.user?.id,
      task: task.id
    })
    task.notes.push(note)
    await Promise.allSettled([note.save(), task.save()])
    res.status(201).send('Note created successfully')
  }

  static deleteNote : RequestHandler = async (req, res, next) => {
    const {noteId} = req.params
    const note = await Note.findById(noteId)
    
    if (!note) {    
      return throwError(next, 'An unexpected error occurred, probably the element you are trying to access is not valid', 404)
    }
    
    if (note.task.toString() !== req.task?.id.toString() || req.user?.id.toString() !== note.createdBy.toString()){
      return throwError(next, 'You cannot perform this action', 401)
    }
    
    req.task.notes = req.task.notes.filter(noteId => noteId?.toString() !== note?.id.toString())
    await Promise.allSettled([req.task.save(), note.deleteOne()])
    res.status(200).send('Note deleted successfully')
  }
}