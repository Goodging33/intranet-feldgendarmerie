async function getUserRole() {
  const { data: userData } = await supabaseClient.auth.getUser();
  if (!userData.user) return null;

  const { data, error } = await supabaseClient
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data.role;
}
