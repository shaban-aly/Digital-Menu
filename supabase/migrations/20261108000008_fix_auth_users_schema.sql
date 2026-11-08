-- Migration: 20261108000008_fix_auth_users_schema.sql
-- Description: Fix NULL string columns in auth.users and ensure auth.identities exist for demo users

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    -- 1. Fix NULL token and string columns that cause GoTrue 500 "converting NULL to string is unsupported"
    UPDATE auth.users
    SET
      confirmation_token = COALESCE(confirmation_token, ''),
      recovery_token = COALESCE(recovery_token, ''),
      email_change = COALESCE(email_change, ''),
      email_change_token_new = COALESCE(email_change_token_new, ''),
      email_change_token_current = COALESCE(email_change_token_current, ''),
      reauthentication_token = COALESCE(reauthentication_token, ''),
      email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
      is_sso_user = COALESCE(is_sso_user, false),
      is_anonymous = COALESCE(is_anonymous, false),
      aud = COALESCE(aud, 'authenticated'),
      role = COALESCE(role, 'authenticated');

    -- 2. Ensure superadmin password is set to Password123!
    UPDATE auth.users
    SET encrypted_password = crypt('Password123!', gen_salt('bf'))
    WHERE email = 'admin@digitalmenu.eg';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'identities') THEN
    -- 3. Ensure identity records exist in auth.identities for email auth
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    SELECT
      id,
      id,
      format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
      'email',
      id::text,
      now(),
      now(),
      now()
    FROM auth.users
    ON CONFLICT (provider, provider_id) DO NOTHING;
  END IF;
END $$;
