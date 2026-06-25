Python 虚拟环境是一个独立的 Python 运行空间，拥有自己的解释器、安装包和配置，与系统全局环境完全隔离。
Python 虚拟环境（Virtual Environment）是一个独立的 Python 运行环境，它允许你在同一台机器上为不同的项目创建隔离的 Python 环境。
不同项目可以在各自的虚拟环境中并行运行，互不干扰。

每个虚拟环境都有自己的：

* Python 解释器
* 安装的包/库
* 环境变量

虚拟环境让每个项目拥有独立的依赖空间，彻底消除版本冲突

## 为什么需要虚拟环境

* **项目隔离**：不同项目可使用不同版本的 Python 和第三方库
* **避免污染**：安装的包只影响当前环境，不污染全局 Python
* **依赖可控**：通过 `requirements.txt` 精确记录和复现环境
* **安全测试**：可以放心升级或试用新包，不影响其他项目

**场景举例：**

* 项目 A 需要 Django 3.2 版本
* 项目 B 需要 Django 4.0 版本
* 如果在系统全局安装，两个版本会冲突

## 第一、 venv 虚拟环境

`venv` 是 **Python 3.3+ 内置的虚拟环境工具**，用于创建**独立、隔离的 Python 运行环境**，解决不同项目依赖版本冲突的问题（例如 A 项目需要 Django 3.2，B 项目需要 Django 4.2）。

- 核心优势：

✅ **无需额外安装**（Python 自带）✅ **轻量、标准、跨平台**✅ **避免污染系统 Python 环境**✅ **官方长期维护**

- 基本用法

### 1️⃣ 创建虚拟环境

```bash
python -m venv venv
```

- `venv`：目录名（可自定义，如 `.venv`、`env`）

### 2️⃣ 激活虚拟环境

✅ Linux / macOS

```bash
source venv/bin/activate
```

✅ Windows（CMD）

```bat
venv\Scripts\activate
```

✅ Windows（PowerShell）

```powershell
venv\Scripts\Activate.ps1
```

激活后终端会显示：

```text
(venv) $
```

### 3️⃣ 退出虚拟环境

```bash
deactivate
```

---

### 常见操作

#### 📦 安装依赖

```bash
pip install requests flask
```

#### 📄 导出依赖

```bash
pip freeze > requirements.txt
```

#### 📥 恢复依赖

```bash
pip install -r requirements.txt
```

---

### 进阶用法

#### 🔹 使用系统 site-packages

```bash
python -m venv venv --system-site-packages
```

#### 🔹 指定 Python 版本

```bash
python3.11 -m venv venv
```

#### 🔹 删除虚拟环境

```bash
rm -rf venv
```

---

### ✅ 最佳实践

✔ 每个项目一个虚拟环境
✔ 不提交 `venv/` 到 Git
✔ `.gitignore` 中加入：

```txt
venv/
.env
```

---

### 常见问题

```bash
# ❓ pip 不是内部命令？
python -m ensurepip --upgrade

# ❓ PowerShell 禁止脚本？
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

```

## 第二、Python 包与环境管理工具 uv

在 Python 开发中，包管理和环境隔离是每个开发者都会遇到的问题。无论是 pip 的缓慢、virtualenv 的繁琐，还是 conda 的臃肿，uv 都让开发者们期待一个更高效的解决方案。

什么是 uv？
uv 是由 Astral 公司开发的一款用 Rust 编写的 Python 包管理器和环境管理器，主要目标是提供比现有工具快 10-100 倍的性能，同时保持简单直观的用户体验。

uv 可以替代 pip、virtualenv、pip-tools、pyenv 等工具，提供依赖管理、虚拟环境创建、Python 版本管理等一站式服务。

uv 的优势
速度极快：由于使用 Rust 编写，uv 的性能远超 pip 和其他包管理工具，安装依赖的速度可以提升 10-100 倍。
功能集成：集依赖解析、包安装、环境管理和 Python 版本管理于一体，无需再安装和学习多个工具。
确定性构建：uv 会生成 uv.lock 文件，确保在任何环境中都能安装完全相同的依赖版本，避免"在我机器上能运行"的问题。
与现有工具兼容：uv 可以处理 requirements.txt 和 pyproject.toml，可以无缝替代现有工作流中的 pip。

参考文章：https://www.runoob.com/python3/uv-tutorial.html
