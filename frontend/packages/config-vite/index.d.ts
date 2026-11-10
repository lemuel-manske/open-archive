import type { UserConfig } from "vite";

interface LibraryOptions {
  entry: string;

  fileName: string;

  external?: string[];
}

declare const reactConfig: UserConfig;

declare function createLibraryConfig(options: LibraryOptions): UserConfig;

export { reactConfig, createLibraryConfig, type LibraryOptions };
