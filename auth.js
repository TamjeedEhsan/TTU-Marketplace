// Sign up a new TTU user
async function signUp(email, password, fullName) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    if (error) {
        console.error("Signup error:", error.message);
        return { data: null, error };
    }

    console.log("Signup successful:", data);
    return { data, error: null };
}


// Log in an existing user
async function logIn(email, password) {
    const { data, error } =
        await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        console.error("Login error:", error.message);
        return { data: null, error };
    }

    console.log("Login successful:", data);
    return { data, error: null };
}


// Log out the current user
async function logOut() {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error.message);
        return;
    }

    window.location.href = "index.html";
}


// Get the currently logged-in user
async function getCurrentUser() {
    const {
        data: { user }
    } = await supabaseClient.auth.getUser();

    return user;
}

async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    window.location.href = "index.html";
    return null;
  }

  return user;
}