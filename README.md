# SMA API client for NodeJS

## Configuration

### **SMA_URL** environment variable

Accepts URL to inverter unit, it should contain protocol and IP or hostname.
_No default value._

```
SMA_URL=https://192.168.0.2
```


### **SMA_USER** environment variable
Accepts inverter API user name. This can be either `adm` or `usr`.
_Defaults to `usr`._

```
SMA_USER=usr
```

### **SMA_PASS** environment variable
Accepts inverter API user password.
_No default value._

```
SMA_PASS=MyPassWord!23
```

### **INTERVAL** environment variable
Accepts number of seconds between each probe.
_Defaults to `300` seconds._

```
INTERVAL=300
```

### **DESTINATION** environment variable
Accepts either webhook URL or path to log file.
_Defaults to `/var/log/sma.log` seconds._

```
DESTINATION=https://www.example.com/sma/webhook
DESTINATION=/var/log/sma.log
```
