import { supabase } from "./supabase.js";

function isMobile() {
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
}

export async function checkDevicePermission() {

  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const userId = sessionData.session.user.id;

  const { data: user, error } = await supabase
    .from("users")
    .select("device_mode")
    .eq("id", userId)
    .single();

  if (error || !user) return;

  const mode = user.device_mode;

  const mobile = isMobile();

  /* ===== RULES ===== */

  if (mode === "desktop" && mobile) {

    document.body.innerHTML = `
     <div style="
height:100vh;
display:flex;
align-items:center;
justify-content:center;
background:linear-gradient(135deg,#0f172a,#1e293b);
font-family:Segoe UI,Arial;
">

<div style="
background:white;
padding:40px;
border-radius:12px;
box-shadow:0 10px 40px rgba(0,0,0,0.3);
text-align:center;
max-width:420px;
width:90%;
">

<div style="
font-size:50px;
margin-bottom:10px;
">🚫</div>

<h2 style="
margin-bottom:10px;
color:#111827;
font-weight:700;
">
Access Restricted
</h2>

<p style="
color:#374151;
margin-bottom:20px;
font-size:15px;
">
This software is allowed only on <strong>Desktop Devices</strong>.
Mobile access is currently restricted.
</p>

<hr style="margin:20px 0;">

<p style="
font-size:14px;
color:#4b5563;
margin-bottom:5px;
">
Need access or facing issues?
</p>

<p style="
font-weight:600;
color:#0f172a;
font-size:16px;
">
Contact <br>
𝗔𝗟 𝗝𝗔𝗗𝗘𝗘𝗗 𝗧𝗘𝗖𝗛 𝗟𝗔𝗕𝗦<br>مُخْتَبَرَاتُ اَلْجَدِيد لِلتِّقْنِيَة
</p>

</div>

</div>
    `;

  }

}
