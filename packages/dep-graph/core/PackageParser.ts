import * as path from 'node:path'
import * as fsPromises from 'node:fs/promises'

export interface Node {
  package: string
  version: string
}

export interface Link {
  source: Node
  target: Node
}

export interface Dependencies {
  nodes: Node[]
  links: Link[]
}

export default abstract class PackageParser {
  protected filepath: string
  protected lockfile: string
  protected nodes: Node[]
  protected links: Link[]

  constructor(filepath: string) {
    this.filepath = filepath
  }

  public async parse(): Promise<Dependencies> {
    if (await this.isFileExist('package.json')) {
      throw new Error(
        `${path.resolve(this.filepath, 'package.json')} is not exist.`
      )
    }
    if (await this.isFileExist(this.lockfile)) {
      throw new Error('package lock file is not exist.')
    }
    await this.parseLockfile()
    return {
      nodes: this.nodes,
      links: this.links
    }
  }

  public getNodes(): Node[] {
    return this.nodes
  }

  public getLinks(): Link[] {
    return this.links
  }

  private async isFileExist(filename: string): Promise<boolean> {
    try {
      await fsPromises.access(path.resolve(this.filepath, filename))
      return true
    } catch {
      return false
    }
  }

  protected abstract parseLockfile(): Promise<Dependencies>
}
