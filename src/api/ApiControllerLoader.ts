import fs from 'fs'

export class ApiControllerLoader {
    public static async loadControllers(controllersDirectory: string) {
        for (let file of fs.readdirSync(controllersDirectory)) {
            if (file.endsWith(".js")) {
                await import(`${controllersDirectory}/${file}`)
            }
        };
    }
}
