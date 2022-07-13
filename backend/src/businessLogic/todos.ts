import { ToDoAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoUpdate } from '../models/TodoUpdate';
import { createLogger } from '../utils/logger'

const logger = createLogger('Todos')

// TODO: Implement businessLogic
const uuidv4 = require('uuid/v4');
const toDoAccess = new ToDoAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return toDoAccess.getAllToDo(userId);
}

export function createToDo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
    const todoId =  uuidv4();
    logger.info(todoId);

    const s3BucketName = process.env.ATTACHMENT_S3_BUCKET;
    logger.info(s3BucketName);
    
    return toDoAccess.createToDo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${s3BucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate
    });
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, userId: string): Promise<TodoUpdate> {
    return toDoAccess.updateToDo(updateTodoRequest, todoId, userId);
}

export function deleteToDo(todoId: string, userId: string): Promise<string> {
    return toDoAccess.deleteToDo(todoId, userId);
}

export function createAttachmentPresignedUrl(todoId: string): Promise<string> {
    return attachmentUtils.generateUploadUrl(todoId);
}