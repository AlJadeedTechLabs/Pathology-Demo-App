import { supabase } from "./supabase.js";

const BASE_PATH = window.location.hostname.includes("github.io")
  ? "/Pathology-Demo-App"
  : "";

/* ========= LOGIN ========= */
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  const userId = data.user.id;

  const { data: licence } = await supabase
    .from("user_licence")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!licence) {
    await supabase.auth.signOut();
    alert("Licence not found. Contact Aljadeed Tech Labs.");
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(licence.expiry_date);
  expiry.setHours(0, 0, 0, 0);

  if (!licence.is_active || today >= expiry) {
    await supabase.auth.signOut();
    alert(
      "Your subscription has expired.\n" +
      "Contact Aljadeed Tech Labs to renew."
    );
    return;
  }

  window.location.href = `${BASE_PATH}/index.html`;
}


/* ========= SIGNUP ========= */
export async function signup(email, password, labname, mobile) {

  const { error } = await supabase.auth.signUp({
    email,
    password,
    phone: mobile, // store in auth.users phone column
    options: {
      data: {
        lab_name: labname,
        mobile: mobile,
        display_name: labname
      }
    }
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Account created! Please verify your email.");
}


/* ========= PAGE PROTECT ========= */
export async function protectPage() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    window.location.href = `${BASE_PATH}/auth/login.html`;
    return;
  }

  const userId = data.session.user.id;

  const { data: licence, error } = await supabase
    .from("user_licence")
    .select("expiry_date,is_active")
    .eq("user_id", userId)
    .single();

  if (error || !licence) {
    await supabase.auth.signOut();
    window.location.href = `${BASE_PATH}/auth/login.html`;
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(licence.expiry_date);
  expiry.setHours(0, 0, 0, 0);

  if (!licence.is_active || today >= expiry) {
    await supabase.auth.signOut();
    alert(
      "Your subscription has expired.\n" +
      "Contact Aljadeed Tech Labs to increase your subscription licence."
    );
    window.location.href = `${BASE_PATH}/auth/login.html`;
  }
}

/* ========= LOGOUT ========= */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = `${BASE_PATH}/auth/login.html`;
}
