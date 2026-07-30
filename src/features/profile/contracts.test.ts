import assert from "node:assert/strict";
import test from "node:test";
import {
  emptyUserProfile,
  parseProfileUpdatePayload,
  profileFormToPayload,
  profileToForm,
  parseUserProfile,
} from "./contracts";

test("empty profiles contain no fabricated identity or contact data", () => {
  assert.deepEqual(emptyUserProfile(), {
    firstName: "",
    lastName: "",
    username: "",
    dob: "",
    phone: "",
    email: "",
    country: "",
    countryCode: "+971",
    city: "",
    aboutMe: "",
    discordLink: "",
    twitchLink: "",
    youtubeLink: "",
    instagramLink: "",
    xLink: "",
    profileImage: "",
    coverImage: "",
    emailVerified: false,
  });
});

test("profile parser accepts upstream aliases without trusting invalid values", () => {
  const profile = parseUserProfile({
    firstName: "  Abhijit ",
    username: "abhijit",
    contact: "+971501234567",
    countryCode: "+971",
    isEmailVerified: true,
    profileImage: "https://cdn.example.com/avatar.webp",
    discord: "abhijit#1234",
    ignored: { nested: true },
  });

  assert.equal(profile.firstName, "Abhijit");
  assert.equal(profile.phone, "+971501234567");
  assert.equal(profile.discordLink, "abhijit#1234");
  assert.equal(profile.emailVerified, true);
  assert.equal(profile.profileImage, "https://cdn.example.com/avatar.webp");
  assert.equal(profile.lastName, "");
});

test("profile form is derived only from returned user data", () => {
  const form = profileToForm(parseUserProfile({ username: "player-one", emailVerified: false }));
  assert.equal(form.userName, "player-one");
  assert.equal(form.countryCode, "+971");
  assert.equal(form.email, "");
  assert.equal(form.aboutMe, "");
});


test("generic profile updates cannot change email or forward unknown fields", () => {
  const form = profileToForm(parseUserProfile({ username: "player-one", email: "old@example.com" }));
  const payload = profileFormToPayload({ ...form, email: "attacker@example.com" });

  assert.equal(Object.hasOwn(payload, "email"), false);
  assert.deepEqual(
    parseProfileUpdatePayload({ ...payload, email: "attacker@example.com", role: "admin" }),
    payload,
  );
});

test("profile update parser rejects invalid usernames and oversized biographies", () => {
  const valid = profileFormToPayload({
    ...profileToForm(parseUserProfile({ username: "player-one" })),
    aboutMe: "Valid profile",
  });

  assert.equal(parseProfileUpdatePayload({ ...valid, username: "x" }), null);
  assert.equal(parseProfileUpdatePayload({ ...valid, aboutMe: "x".repeat(501) }), null);
});
