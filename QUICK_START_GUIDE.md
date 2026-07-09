# 🚀 Kanha Graphics - Quick Start Guide

This guide explains how to run your website on your laptop and access it from any device connected to your WiFi network.

---

## 📱 **Website Accessibility**

Your website is now **fully responsive** and works perfectly on:
- ✅ **Desktop/Laptop** (Chrome, Firefox, Edge, Safari)
- ✅ **Mobile phones** (iOS, Android)
- ✅ **Tablets** (iPad, Android tablets)
- ✅ **Any device on your WiFi network**

---

## 🖥️ **Your Network Information**

**Your Computer's IP Address:** `192.168.1.2`

**Access your website from:**
- This laptop: `http://localhost:3000`
- Other devices on WiFi: `http://192.168.1.2:3000`

Replace `192.168.1.2` with your IP address if it changes (see "Find Your IP" below).

---

## ▶️ **How to Run the Website**

### **Option 1: Quick Start (Recommended for Development)**

1. **Open PowerShell** (press `Win + X`, select "Windows PowerShell")
2. **Navigate to your project:**
   ```powershell
   cd C:\Users\ayush\Desktop\KG\kanha-graphics
   ```
3. **Start the development server:**
   ```powershell
   npm run dev
   ```
4. **You'll see:**
   ```
   - Local:        http://localhost:3000
   - Environments: .env.local
   ```

✅ Server is running! Open your browser to `http://localhost:3000`

---

### **Option 2: Production Build (For Better Performance)**

Use this if you want the fully optimized version:

1. **Open PowerShell** and navigate to project:
   ```powershell
   cd C:\Users\ayush\Desktop\KG\kanha-graphics
   ```

2. **Build the project:**
   ```powershell
   npm run build
   ```

3. **Start the production server:**
   ```powershell
   npm start -- --hostname 0.0.0.0
   ```

4. **Access at:** `http://localhost:3000` or `http://192.168.1.2:3000`

---

### **Option 3: Using Mobile Preset Script**

If you created a `package.json` with mobile support:

```powershell
cd C:\Users\ayush\Desktop\KG\kanha-graphics
npm run dev:mobile
```

This ensures compatibility for mobile devices.

---

## 📍 **Find Your Current Network IP Address**

Your IP can change if you restart your computer. Use this to find the current IP:

1. **Open PowerShell**
2. **Run this command:**
   ```powershell
   ipconfig | Select-String "IPv4 Address"
   ```
3. **Look for your WiFi adapter's address**
   - Example output: `192.168.1.2`

---

## 📲 **Access from Other Devices**

Once the server is running on your laptop:

### **From Your Phone (All Phones - iOS/Android):**

1. Find your laptop's IP address (see above)
2. Open any phone browser
3. Type: `http://192.168.1.2:3000`
4. ✅ Site loads responsively in mobile view!

### **From a Tablet:**
- Same as phone: `http://192.168.1.2:3000`

### **From Another Laptop/Computer on Same WiFi:**
- Go to: `http://192.168.1.2:3000`
- Or if you know the computer name: `http://[computer-name]:3000`

### **From Outside WiFi Network:**
- ❌ Not accessible (requires VPN or port forwarding - not recommended)

---

## 🎨 **Responsive Design Features**

Your website automatically adapts to any screen size:

| Device | Breakpoint | Features |
|--------|-----------|----------|
| **Mobile** | < 768px | Bottom navigation, compact menus, full-width forms |
| **Tablet** | 768px - 1024px | 2-column layouts, optimized spacing |
| **Desktop** | > 1024px | Full 3-column layouts, top navigation, expanded menus |

**Test responsiveness with:**
- On desktop browser: Press `F12` → Click mobile icon
- On actual phone: Just visit the URL

---

## ⏹️ **How to Stop the Server**

When running the development server:

**In PowerShell:**
- Press `Ctrl + C` to stop

**To kill server if stuck:**
```powershell
lsof -i :3000  # Find process using port 3000
taskkill /PID <process_id> /F  # Kill it
```

---

## 🔄 **Restart the Server (Anytime)**

Simply follow **Option 1** again:
```powershell
cd C:\Users\ayush\Desktop\KG\kanha-graphics
npm run dev
```

The process takes ~5-10 seconds to start.

---

## 🐛 **Troubleshooting**

### **"Port 3000 is in use"**
- Kill the existing process: 
  ```powershell
  taskkill /IM node.exe /F
  ```

### **"Can't connect from phone"**
- ✅ Check both devices are on same WiFi
- ✅ Use correct IP address from `ipconfig`
- ✅ Include the port `:3000` in URL

### **"Styles not loading on phone"**
- Hard refresh: Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
- Clear phone browser cache and reload

### **"Database not found"**
- Run: `npm run db:push` to initialize database

---

## 📝 **Environment Setup (One-Time Only)**

If you restart and server won't start:

1. **Check Node.js is installed:**
   ```powershell
   node --version
   npm --version
   ```

2. **Install dependencies (if needed):**
   ```powershell
   cd C:\Users\ayush\Desktop\KG\kanha-graphics
   npm install
   ```

3. **Generate Prisma client:**
   ```powershell
   npm run db:generate
   ```

Then try `npm run dev` again.

---

## ✨ **Quick Command Reference**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server (best for development) |
| `npm run build` | Build optimized version |
| `npm start` | Run production version |
| `npm run db:push` | Update database schema |
| `npm run lint` | Check code for errors |

---

## 🌟 **Key Features for Mobile/Network**

✅ **Fully Responsive Design**
- Mobile-first approach
- Touch-friendly buttons and inputs
- Optimized layouts for all screen sizes

✅ **Network Accessible**
- Configured to listen on all interfaces (0.0.0.0)
- Works from any device on your WiFi
- No extra setup needed

✅ **Mobile Optimized**
- Fast loading times
- Optimized images
- Touch-friendly interface
- Works offline (with offline features)

---

## 📞 **Need Help?**

If something's not working:

1. **Check the terminal output** - errors will show there
2. **Try the troubleshooting section** above
3. **Restart the server** with `npm run dev`
4. **Clear cache** on browser/phone and reload

---

**Happy coding! Your website is now ready to use anytime.** 🎉
