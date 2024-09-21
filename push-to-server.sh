#!/bin/bash

# 1. 通过 SSH 连接到服务器
SERVER="sheben@server-xjp"

# 2. 把当前路径下的 mx-server-core.zip 文件复制到服务器的 ~/GitHub 目录下
LOCAL_FILE="mx-server-core.zip"
REMOTE_DIR="~/GitHub"

scp $LOCAL_FILE $SERVER:$REMOTE_DIR

# 3. 连接服务器，解压 mx-server-core.zip 文件
ssh $SERVER << 'EOF'
    # 进入 GitHub 目录
    cd ~/GitHub
    
    # 删除旧的 mx-server-core 文件夹
    rm -rf mx-server-core
    
    # 解压 mx-server-core.zip 文件
    unzip -o mx-server-core.zip -d mx-server-core
    
    # 删除 zip 文件（可选）
    rm mx-server-core.zip
    
    # 4. 在 ~/GitHub/mx-server-core 路径下启动 pm2
    cd mx-server-core
    
    # 加载环境变量，避免 pm2 启动失败
    source ~/.bashrc
    
    # 启动 pm2
    pm2 start ecosystem.config.js
EOF

echo "操作完成。"
