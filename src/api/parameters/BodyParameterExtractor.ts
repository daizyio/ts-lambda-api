import { plainToClass } from 'class-transformer'
import { validateSync, ValidationError, ValidatorOptions } from 'class-validator'
import { Request } from "lambda-api"

import { BaseParameterExtractor } from "./BaseParameterExtractor"

export class BodyParameterExtractor extends BaseParameterExtractor {
    public readonly source = "virtual"
    public readonly name = "body"

    public constructor(private type?: new() => any, private options: ValidatorOptions & { validate?: boolean, array?: boolean } = {} ) {
        super(BodyParameterExtractor)
    }

    public extract(request: Request) {
        this.logger.debug("Extracting body from request")
        this.logger.trace("Request body: %j", request.body)

        if (!this.type) {
          return request.body
        } else {
          if (typeof request.body !== 'object') {
            throw new Error(`Request body is not a valid object and cannot be converted to the requested type`)
          }

          if (this.options.array) {
            if (!Array.isArray(request.body)) {
              throw new Error(`Request was passed array flag but body is not a valid array and cannot be converted to the array based requested type`)
            }
            let errors: string[] = [];
            const objs = request.body.map((obj: any) => {
              try {
                return this.transformValidate(obj)
              } catch (error) {
                if (Array.isArray(error)) {
                  errors = errors.concat(error)
                } else {
                  throw error
                }
              }
            })
            if (errors.length > 0) {
              throw errors
            }
            return objs
          } else {
            return this.transformValidate(request.body)
          }
        }
    }

    private transformValidate(body: any): any {
      const obj = plainToClass(this.type, body)

      if (this.options.validate ?? true) {
        this.options.forbidNonWhitelisted = this.options.forbidNonWhitelisted ?? false
        this.options.whitelist = this.options.whitelist ?? true

        const errors = validateSync(obj, this.options)

        if (errors.length > 0) {
          throw this.transformErrors(errors)
        }
      }
      return obj
    }

    private transformErrors(errors: ValidationError[], parent?: string): string[] {
      if (!errors) {
        return []
      }
      const msgs = errors.reduce((list, error) => {
        const errMessages = error.constraints ? Object.values(error.constraints) : this.transformErrors(error.children, error.property)
        return list.concat(...errMessages.map(msg => parent ? `${parent}.${msg}` : msg))
      }, [] as string[])

      return msgs
    }
}
