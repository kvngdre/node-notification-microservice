import * as process from "process";
import { exec } from "child_process";

const args = process.argv.slice(2);

if (args.length > 0) {
  const filename = args[0];

  // Validating filename
  if (filename && !/^[a-z_]{3,30}$/.test(filename)) {
    console.error(`Error: Invalid filename: ${filename}`, [
      "Migration filename can only be in lowercase and contain underscore.",
      `Migration filename length(${filename.length}) must between 3 and 30.`
    ]);

    process.exit(1);
  }

  // Running the typeorm migration generation command
  exec(
    `npx typeorm migration:generate ./src/infrastructure/database/migrations/${filename}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`, error.stack);
        return;
      }

      if (stderr) {
        console.error(stderr);
        return;
      }

      console.log(stdout);
    }
  );
} else {
  console.error("Error: migration file name required");
}
