# Architecture & API Analysis Report

This report summarizes the current state of the project's API integration and TanStack Query usage, highlighting strengths and proposing architectural improvements for better scalability and maintainability.

## Current Strengths

### 1. Centralized API Configuration

- **Axios Instance**: The project uses a centralized axios instance in `src/api/axios.ts` with `baseURL` and interceptors for `Authorization` headers. This is a best practice.
- **Auth Management**: Memory-only access token storage with `withCredentials: true` suggests a secure cookie-based refresh token strategy.

### 2. Modular API Layer

- **Entity-based Files**: API calls are logically grouped by entity (e.g., `patient.api.ts`, `medication.api.ts`) in the `src/api/` directory.

### 3. Custom Hooks for Data Fetching

- **Separation of Concerns**: Custom hooks in `src/hooks/` (e.g., `usePatients.ts`) abstract the `useQuery` logic, making components cleaner.
- **In-hook Transformation**: Several hooks handle decryption and data mapping using utility functions, ensuring that components receive "ready-to-use" data.

### 4. Advanced TanStack Query Usage

- **Optimistic Updates**: You are correctly implementing optimistic updates in dashboards (e.g., `PatientsDashboard.tsx`) for a snappier user experience.
- **Stale Time Configuration**: Judicious use of `staleTime` in hooks helps reduce unnecessary API calls.

---

## Recommended Improvements

### 1. Centralized Query Key Factory

**Current Issue**: String keys like `["patients"]` are scattered across the codebase. This is prone to typos and makes it harder to manage dependent cache invalidations.
**Solution**: Create a `src/hooks/queryKeys.ts` factory.

```typescript
export const patientKeys = {
  all: ["patients"] as const,
  details: (id: string) => [...patientKeys.all, "detail", id] as const,
  list: (filters: any) => [...patientKeys.all, "list", { filters }] as const,
};
```

### 2. Modular Mutation Hooks

**Current Issue**: Large `useMutation` blocks (optimistic updates, error handling) are defined inside component files, making components bulky.
**Solution**: Move mutations to dedicated hooks.

```typescript
// src/hooks/useDeletePatient.ts
export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePatient,
    onMutate: async (id) => {
      /* logic */
    },
    // ...
  });
};
```

### 3. Enhanced Type Safety (Zod)

**Current Issue**: Most API responses are handled as `any`, and manual mapping is done via `Promise.all` in hooks.
**Solution**: Use Zod to define schemas for API responses. This provides runtime validation and automatic TypeScript types.

```typescript
const MedicineSchema = z.object({
  id: z.string(),
  name: z.string(), // encrypted
  // ...
});
```

### 4. Consistent API Function Usage

**Current Issue**: Some hooks use `api.get` directly, while others use functions from `src/api/`.
**Solution**: Standardize by always using functions from the `api` layer within hooks. This makes it easier to change endpoints or request configurations in one place.

### 5. Standardized Error Handling

**Current Issue**: `handleApiError` is excellent, but it requires manual calling in every `catch` block or mutation.
**Solution**: Consider using TanStack Query's `defaultOptions` in the `QueryClient` to handle global error notifications, while still allowing local overrides for specific cases.

### 6. Service/Transformer Layer

**Current Issue**: Decryption logic is mixed into hooks and utils.
**Solution**: As the project grows, consider a dedicated `services/` layer that handles complex business logic and nested decryption, keeping hooks purely about data synchronization.

---

## Conclusion

The project has a solid foundation. The most impactful next steps would be implementing a **Query Key Factory** and moving **Mutations into Custom Hooks**. These changes will significantly reduce boilerplate and prevent common "typo-based" bugs in cache management.
