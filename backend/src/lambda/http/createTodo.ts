import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createToDo } from '../../businessLogic/todos'

const logger = createLogger('TodosAccess')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Request', event);
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    logger.info('Create Todo Request', newTodo);
    // TODO: Implement creating a new TODO item
    const userId = getUserId(event);
    logger.info(userId);

    const toDoItem = await createToDo(newTodo, userId);
    logger.info(toDoItem);

    return {
      statusCode: 201,
      headers: {
          "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        "item": toDoItem
      }),
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
