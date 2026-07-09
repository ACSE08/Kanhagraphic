# ⚡ **How to Run Your Website Anytime**

Quick reference for running Kanha Graphics website locally.

---

## 🚀 **EASIEST WAY (2 Clicks)**

### **Option 1: Double-Click Batch File** (Recommended)

1. **Go to:** `C:\Users\ayush\Desktop\KG\kanha-graphics\`
2. **Find:** `START_SERVER.bat`
3. **Double-click** it
4. **Done!** Window shows:
   ```
   ✅ Starting development server...
   📱 Access your website from:
      • This Computer: http://localhost:3000
      • Other Devices: http://192.168.1.2:3000
   ```

✅ **No typing needed!**
✅ **Automatically finds your IP**
✅ **Shows all access URLs**

---

## 🎯 **QUICK COMMAND WAY (3 Steps)**

### **Option 2: PowerShell Command**

1. **Press:** `Win + X` → Select `Windows PowerShell` or `Terminal`
2. **Paste:**
   ```powershell
   cd C:\Users\ayush\Desktop\KG\kanha-graphics; npm run dev
   ```
3. **Press:** `Enter`

**Output:** You'll see `► Local: http://localhost:3000`

---

## 📱 **ACCESS YOUR WEBSITE**

Once server is running:

### **On Your Laptop/Desktop:**
```
http://localhost:3000
```

### **On Your Phone/Tablet (Same WiFi):**
```
http://192.168.1.2:3000
```

✅ Open in any browser
✅ Works on iPhone, Android, iPad
✅ Fully responsive

---

## 🛑 **STOP THE SERVER**

When running in terminal/PowerShell:
- Press **`Ctrl + C`**
- Type `Y` if prompted and press Enter

---

## 🔄 **RESTART THE SERVER**

Same as starting:
1. Run `npm run dev` again
2. Or double-click `START_SERVER.bat`

---

## 💾 **FIRST TIME SETUP ONLY**

When you first run the server (only needs to happen once):

1. Dependencies install automatically
2. Database sets up automatically
3. Next time is instant

---

## 👥 **SHARE WITH OTHERS ON WiFi**

1. **Get your IP:** Look at terminal output (e.g., `192.168.1.2`)
2. **Share URL:** `http://192.168.1.2:3000`
3. **Friends/family open it** on their devices

---

## ✨ **THAT'S IT!**

Your website is now:
- ✅ Running
- ✅ Accessible locally
- ✅ Accessible on your network
- ✅ Responsive (mobile & desktop)
- ✅ Ready to use

---

## 🎨 **Make Changes & See Live**

1. **Edit any file** in `C:\Users\ayush\Desktop\KG\kanha-graphics\`
2. **Save** (Ctrl+S)
3. **Refresh browser** (F5 or Ctrl+R)
4. ✅ Changes appear instantly!

(No restart needed - Next.js auto-recompiles)

---

## 🐛 **If Something Goes Wrong**

### **Server won't start?**
```powershell
taskkill /IM node.exe /F
start C:\Users\ayush\Desktop\KG\kanha-graphics\START_SERVER.bat
```

### **Port 3000 already in use?**
```powershell
netstat -ano | Select-String ":3000"
taskkill /PID <number> /F
```

### **Can't connect from phone?**
- ✅ Both on same WiFi?
- ✅ Using correct IP? (not localhost)
- ✅ Including port `:3000`?

---

## 📋 **Server Running Checklist**

- [ ] Terminal shows `▲ Next.js ...` running
- [ ] `http://localhost:3000` loads in browser
- [ ] Phone can access `http://192.168.1.2:3000`
- [ ] Website looks good on mobile
- [ ] All pages load
- [ ] Forms work
- [ ] No red errors in terminal

---

## 🎯 **That's All You Need to Know!**

**Every time you want to run your website:**

| Method | Steps | Time |
|--------|-------|------|
| Double-click .bat | 1 click | 5 sec |
| PowerShell | 3 commands | 5 sec |
| Browser refresh | 1 key press | Instant |

---

**Your website is ready.** 🚀 Just run it anytime!
