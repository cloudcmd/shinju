# Shinju


Node client for [Cloud Commander](http://cloudcmd.io).

# Install

Install Shinju globally with npm:

```
npm i shinju -g
```

# Use
To use Shinju just start it with url wich is first parameter.

```sh
shinju <url>
```
Exit with `Ctrl` + `C`.

# Example

```sh
> shinju http://localhost:8000

/home/coderaiser/cloudcmd> ps
  PID TTY          TIME CMD
  661 pts/0    00:00:00 ps
32199 pts/0    00:00:00 bash
32622 pts/0    00:00:01 node

/home/coderaiser/cloudcmd> whoami
coderaiser

/home/coderaiser/cloudcmd>

```

# License

MIT
