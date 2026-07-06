pyenv 是 pyenv/pyenv 这套老牌工具，**只干一件事：在一台机器上装多个 CPython 版本，并按全局 / 项目 / 会话三个层级切换**。它不管虚拟环境、不管依赖锁——这两块要配 `pyenv-virtualenv` 插件或用 poetry/uv 来补。上轮讲的 uv 是"解释器 + 环境 + 依赖"一把梭，pyenv 则是"我就管好版本"，所以在 "Linux 服务器 / macOS 开发机 / 老项目还在 poetry" 的场景里依然很稳。

下面按「装 → 用 → 踩坑」走。

## 一、安装（分系统）

### 🍎 macOS（推荐 brew）

```bash
brew update
brew install pyenv

# zsh 用户（macOS 默认）
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
echo 'eval "$(pyenv init -)"' >> ~/.zshrc
source ~/.zshrc
```

> 💡 M 芯片 Mac 如果 `pyenv install` 卡编译，确认 Xcode Command Line Tools 在：`xcode-select --install`

### 🐧 Linux（Ubuntu/Debian 为例）

先装**编译依赖**，这步漏了 `pyenv install` 必报 C compiler 错：

```bash
sudo apt update
sudo apt install -y make build-essential libssl-dev zlib1g-dev \
    libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm \
    libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev \
    libffi-dev liblzma-dev
```

然后两种装法二选一：

**方案 A：apt 直接装（Ubuntu 官方推的，省事）**

```bash
sudo apt install pyenv
# 再补 shell 配置（同上，但 PYENV_ROOT 默认可能在 /usr/share/pyenv，看情况调）
```

**方案 B：官方脚本（版本最新）**

```bash
curl -fsSL https://pyenv.run | bash

# bash 用户
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo '[[ -d $PYENV_ROOT/bin ]] && export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(pyenv init - bash)"' >> ~/.bashrc
source ~/.bashrc
```

> zsh/fish/nushell 用户把 `.bashrc` 换成对应 rc 文件即可，官方 README 有各 shell 模板。

### 🪟 Windows

pyenv 原生不支持 Windows，用 **pyenv-win**：

```powershell
# PowerShell 管理员运行
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope LocalMachine
Invoke-WebRequest -UseBasicParsing `
  -Uri "https://raw.githubusercontent.com/pyenv-win/pyenv-win/master/pyenv-win/install-pyenv-win.ps1" `
  -OutFile "./install-pyenv-win.ps1"
& "./install-pyenv-win.ps1"
```

装完重开 PowerShell，`pyenv --version` 验证。更懒的也可以用 `pip install pyenv-win` 再配环境变量，但 PowerShell 脚本最稳。

## 二、核心使用

### 1. 看 & 装 Python 版本

```bash
pyenv install --list | grep "3\.11"   # 搜可用版本
pyenv install 3.11.7                  # 装指定版本（编译，要等一会儿）
pyenv install 3.8.18
pyenv versions                        # 看本机已装的所有版本
pyenv version                         # 看当前 shell 正在用哪个
```

### 2. 切换版本（三个层级）

```bash
pyenv global 3.11.7        # 全局默认（写 ~/.pyenv/version）
pyenv local 3.8.18         # 当前目录写 .python-version，进目录自动切（项目级⭐）
pyenv shell 3.11.7         # 仅当前 shell 会话，关终端失效
```

> 📌 `pyenv local` 是最常用的——每个项目根目录 `pyenv local 3.9.18`，cd 进去自动切，团队协同时 `.python-version` 提交 Git 即可。

### 3. 卸载

```bash
pyenv uninstall 3.8.18
```

## 三、配虚拟环境：pyenv-virtualenv 插件

pyenv 本体不管 venv，官方插件补上：

```bash
# macOS
brew install pyenv-virtualenv

# Linux：pyenv 装完自带插件目录，没有就 git clone 进 ~/.pyenv/plugins
```

Shell 里再加一行（跟 `pyenv init` 放一起）：

```bash
eval "$(pyenv virtualenv-init -)"
```

用法：

```bash
pyenv virtualenv 3.11.7 myproj-311      # 基于 3.11.7 建 env
pyenv activate myproj-311                # 激活
pyenv deactivate                        # 退出
pyenv virtualenvs                       # 列所有 env
pyenv virtualenv-delete myproj-311       # 删
```

配合 `pyenv local myproj-311` 还能做到 cd 进目录自动激活 env（靠 `.python-version` 里写 env 名而不是版本号）。

## 四、国内必踩：安装慢 / 超时

`pyenv install` 默认从 python.org 拉 tarball，国内经常断。两招：

**临时用清华镜像**：

```bash
export PYTHON_BUILD_MIRROR_URL="https://mirrors.tuna.tsinghua.edu.cn/python/"
pyenv install 3.11.7
```

**永久写进 shell rc**：

```bash
echo 'export PYTHON_BUILD_MIRROR_URL="https://mirrors.tuna.tsinghua.edu.cn/python/"' >> ~/.zshrc
```

## 五、典型工作流示例

```bash
# 机器上先装几个版本
pyenv install 3.9.18
pyenv install 3.11.7
pyenv global 3.11.7          # 默认用 3.11

# 进老项目，切 3.9
cd ~/projects/legacy-django
pyenv local 3.9.18           # 生成 .python-version
python -m venv .venv         # 或 pyenv virtualenv 3.9.18 legacy-django
source .venv/bin/activate
pip install -r requirements.txt

# 进新项目，切 3.11
cd ~/projects/new-fastapi
pyenv local 3.11.7
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn
```

## 六、pyenv vs uv（呼应上轮）


| 维度             | pyenv                      | uv                      |
| ---------------- | -------------------------- | ----------------------- |
| 装多版本 CPython | ✅ 原生                    | ✅`uv python install`   |
| 项目级自动切换   | ✅`.python-version`        | ✅ 同                   |
| 虚拟环境         | 靠插件 / venv              | ✅`uv venv` / `uv sync` |
| 依赖 + 锁        | ❌ 配 poetry/pipenv        | ✅`uv add` + `uv.lock`  |
| 速度             | 编译安装慢                 | 预编译二进制，秒级      |
| 适合场景         | 老项目、服务器、只要管版本 | 新项目一站式、想要快    |

> 💡 简单判断：如果你已经是 **pyenv + poetry** 这套跑得很顺，没必要硬迁；如果**新开项目**或者**嫌 pyenv install 编译太慢**，直接 uv 一把梭更爽。两套也能共存——uv 的 `uv python install` 其实可以当 pyenv 的提速替代品用。

要不要再补一段「老项目从 pyenv+poetry 迁到 uv」的命令对照，或者直接给个 pyenv + poetry 的标准协作流？

---

---

# 问题：在安装pyenv之前已有安装python 3.10.0 ，安装pyenv有影响吗？全局版本是python 3.10.0吗？

不会有冲突，但有个**关键点要先说清**：pyenv 装完，**全局默认不会自动变成你原来的 3.10.0**，而是落到 `system`（即系统原来的那个 Python，通过 `/usr/bin/python3` 这类路径调），而且你原来的 3.10.0 **不会被 pyenv 收编**——`pyenv versions` 里看不到它。

下面拆开讲。

## 一、pyenv 装完，原来的 Python 3.10.0 怎样了？

**原封不动，不会被覆盖、不会被删。**

pyenv 的原理是 **shim 路径拦截**，不是替换：

1. 安装时往你的 shell rc 里加一段 `eval "$(pyenv init -)"`
2. 这段会把 `~/.pyenv/shims` 插到 `PATH` **最前面**
3. 你敲 `python` 时，系统先命中 `~/.pyenv/shims/python` 这个 shim 脚本
4. shim 再根据当前生效的版本（shell / local / global / system 四级优先级）决定转发到哪个真实解释器

所以原来的 3.10.0 还在原地（比如 `/usr/bin/python3` 或 `/Library/Frameworks/...` 或 brew 的 `$(brew --prefix)/bin/python3`），只是被 shim "盖住"了。**系统依赖它的东西（macOS/Linux 一些系统工具）也不会坏**——反而提醒一句：系统自带的 Python 千万别手删，不知道哪些工具在用 。

## 二、装完 pyenv，全局默认是 Python 3.10.0 吗？

**不是。** 分两种情况：

### 情况 A：你还没执行过 `pyenv global`

此时 `~/.pyenv/version` 这个文件**不存在**，pyenv 走四级优先级的兜底——**`system`**，也就是"绕过 pyenv 管理的版本，用 PATH 里剩下的第一个 python"。

验证一下：

```bash
pyenv version      # 显示 system 或 "(set by ...)" 无 global 文件
which python       # 先看 shim：~/.pyenv/shims/python
which -a python    # 看全链路，system 的那个会在后面，如 /usr/bin/python3
python --version   # 应该还是你原来的 3.10.0（走 system 路径）
```

所以"装完 pyenv 全局是 3.10.0"——**只对一半**：版本号没错，但 3.10.0 是 `system` 身份，不是 pyenv 管理的。

### 情况 B：你执行了 `pyenv global 3.10.0`

前提是你得先 `pyenv install 3.10.0` 装过一份 pyenv 托管的，否则会报错"version `3.10.0' not installed"。

> ⚠️ 这里容易踩坑：**原来机器上的 3.10.0 ≠ pyenv 里的 3.10.0**。pyenv 的版本都存在 `~/.pyenv/versions/` 下独立目录，跟系统那份是两码事。你原来那 3.10.0 不会自动"进"pyenv 管理。

## 三、你这个场景该怎么弄

如果你就是想"保留原来的 3.10.0 当全局默认，pyenv 只用来切项目"——**什么都不用做**，`pyenv global` 不设置就默认 `system`，原来的 3.10.0 照常跑。

如果你想"把 3.10.0 交给 pyenv 管"——得重新装一份：

```bash
pyenv install 3.10.0          # pyenv 自己编译/下一盘 3.10.0 到 ~/.pyenv/versions/
pyenv global 3.10.0           # 写 ~/.pyenv/version，之后全局走 pyenv 的 3.10.0
pyenv which python            # 看路径，应该是 ~/.pyenv/versions/3.10.0/bin/python
```

原来的那份 3.10.0 还在，想用可以 `pyenv global system` 切回去。

## 四、快速自检三连

装完 pyenv 跑一遍，心里就有数了：

```bash
which python          # shim 路径？还是原路径？
pyenv version         # system 还是某个具体版本？
pyenv versions        # 列出 pyenv 托管的，system 也会显示
```

- `pyenv versions` 里只有 `system` 带星 → 没设 global，走原 Python
- `pyenv versions` 里 `3.10.0` 带星 → 你 `pyenv install` 过并 `global` 设了，走 pyenv 托管的那份

---

---

# 问题：如何查看当前系统默认的Python版本是哪个？

直接跑这两条就够了：

```bash
python --version      # 或 python3 --version
which python          # 看这个 python 实际指向哪个路径
```

`which python` 出来的路径能告诉你身份：

- `/usr/bin/python3` → 系统自带（Linux/macOS 老系统）
- `/opt/homebrew/bin/python3`（M 芯片 Mac）或 `/usr/local/bin/python3`（Intel Mac）→ Homebrew 装的
- `~/.pyenv/shims/python` → pyenv 托管的（再看 `pyenv version` 知具体几版）
- `~/.asdf/shims/python` → asdf 托管的

如果想看**完整 PATH 链路**（被 pyenv/asdf 挡住时特别有用）：

```bash
which -a python       # macOS/Linux 通用，列出 PATH 中所有 python
type -a python        # bash/zsh 内置，更准，能看到 alias/function/shell builtin
```

Linux 还能用：

```bash
ls -l $(which python)   # 顺着软链追到真实位置
```

**结合你上轮的 pyenv 场景**，装完 pyenv 还没设 `global` 时：

```bash
pyenv version    # 显示 system，说明当前走的是原系统那份 3.10.0
which python     # ~/.pyenv/shims/python（shim 层）
which -a python  # 第一个是 shim，第二个才是 /原来的/path/python3
```

`pyenv version` 看的是 pyenv 视角下的"当前生效版本"，`python --version` 看的是真正跑起来的版本号，两个对着看就不会懵。
