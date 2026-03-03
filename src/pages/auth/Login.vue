<template>
  <div class="grid min-h-full place-items-center p-4">
    <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div class="text-xl font-semibold">Admin Login</div>
      <div class="mt-1 text-sm text-slate-600">
        This is a mock login for the dashboard starter. Pick a role to test route guards.
      </div>

      <div class="mt-6 space-y-3">
        <label class="block">
          <div class="text-xs font-medium text-slate-600">Name</div>
          <input v-model="name" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900/10" />
        </label>

        <label class="block">
          <div class="text-xs font-medium text-slate-600">Role</div>
          <select v-model="role" class="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2">
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ELECTION_ADMIN">ELECTION_ADMIN</option>
            <option value="AUDITOR">AUDITOR</option>
          </select>
        </label>

        <button
          class="mt-2 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
          @click="login"
        >
          Sign in
        </button>

        <div class="text-xs text-slate-500">
          Tip: AUDITOR can access Audit Logs but not Settings.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import type { Role } from "@/types/models";
import { useRouter } from "vue-router";
import { useAuditStore } from "@/stores/audit.store";

const auth = useAuthStore();
const audit = useAuditStore();
const router = useRouter();

const name = ref("Admin User");
const role = ref<Role>("SUPER_ADMIN");

function login() {
  auth.loginMock({ name: name.value, role: role.value });
  audit.add(name.value, "login", `role=${role.value}`);
  router.push({ name: "overview" });
}
</script>