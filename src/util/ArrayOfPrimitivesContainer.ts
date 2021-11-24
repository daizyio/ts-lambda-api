import { Type } from 'class-transformer'
import { IsArray, IsOptional, IsNumber, IsString, IsBoolean, ValidateNested } from 'class-validator'

export class ArrayOfPrimitivesContainer {

  constructor(arrayOfValues?: number[] | string[] | boolean[], private type?: 'number' | 'string' | 'boolean') {
    switch (this.type) {
      case 'number':
        this.arrayOfPrimitivesContainer_ArrayOfNumbers = arrayOfValues as number[]
        break
      case 'string':
        this.arrayOfPrimitivesContainer_ArrayOfStrings = arrayOfValues as string[]
        break
      case 'boolean':
        this.arrayOfPrimitivesContainer_ArrayOfBooleans = arrayOfValues as boolean[]
        break
    }
  }

  public getArray(type?: 'number' | 'string' | 'boolean'): any[] {
    type = type || this.type
    switch (this.type) {
      case 'number':
        return this.arrayOfPrimitivesContainer_ArrayOfNumbers
      case 'string':
        return this.arrayOfPrimitivesContainer_ArrayOfStrings
      case 'boolean':
        return this.arrayOfPrimitivesContainer_ArrayOfBooleans
      default:
        return []
    }
  }

  @IsArray() @IsOptional() @IsNumber({}, {each: true})
  public arrayOfPrimitivesContainer_ArrayOfNumbers: number[]

  @IsArray() @IsOptional() @IsString({each: true})
  public arrayOfPrimitivesContainer_ArrayOfStrings: string[]

  @IsArray() @IsOptional() @IsBoolean({each: true})
  public arrayOfPrimitivesContainer_ArrayOfBooleans: boolean[]
}