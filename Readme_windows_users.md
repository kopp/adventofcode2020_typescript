# Windows users

should do the following adaptions:

## Path to `node`

If you installed the `node` binary by just unzipping a zip folder, the path
needs to be added.

This has to be done once for the terminal in
`.vscode/settings.json`:
Add/set the following content and adapt the path accordingly.
Note: Use `\\` for file system separator slashes:

```
{
    "terminal.integrated.env.windows": {
        "PATH": "C:\\Users\\yourname\\somepath\\node-v14.15.1-win-x64;${env:PATH}"
    },
    "python.pythonPath": "C:\\Program Files\\Anaconda3\\python.exe"
}
```

The same needs to be done in `.vscode/launch.json`:
Add a `runtimeExecutable` key for stuff to execute:

    "runtimeExecutable": "C:\\Users\\yourname\\somepath\\node-v14.15.1-win-x64\\node.exe"