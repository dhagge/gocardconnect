#!/bin/sh
#
# Note runlevel 2345, 86 is the Start order and 85 is the Stop order
#
# chkconfig: 2345 86 85
# description: Node.js service for gocardconnect billpay

##############
# Steps (perform every time this file is modified):
# sudo cp ./init.d /etc/init.d/gocardconnect
# sudo chmod a+x /etc/init.d/gocardconnect
# sudo chkconfig --add gocardconnect
# chkconfig
##############

# Below is the source function library, leave it be
. /etc/init.d/functions

# result of whereis forever or whereis node
export PATH=$PATH:/usr/bin/forever  
# result of whereis node_modules
export NODE_PATH=$NODE_PATH:/usr/lib/node_modules


start(){  
        NODE_ENV=production forever start -a -l /home/ec2-user/logs/forever.log -o /home/ec2-user/logs/out.log -e /home/ec2-user/logs/err.log /home/ec2-user/code/gocardconnect/server.js
}

stop(){  
        forever stop /home/ec2-user/code/gocardconnect/server.js
}

restart(){  
        NODE_ENV=production forever restart -a -l /home/ec2-user/logs/forever.log -o /home/ec2-user/logs/out.log -e /home/ec2-user/logs/err.log /home/ec2-user/code/gocardconnect/server.js
}

case "$1" in  
        start)
                echo "Start service gocardconnect"
                start
                ;;
        stop)
                echo "Stop service gocardconnect"
                stop
                ;;
        restart)
                echo "Restart service gocardconnect"
                restart
                ;;
        *)
                echo "Usage: $0 {start|stop|restart}"
                exit 1
                ;;
esac  