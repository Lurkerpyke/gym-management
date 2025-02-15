// app/dashboard/page.tsx
export default async function Schedule() {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simula um carregamento de 3s

    return <div>Página do Dashboard</div>;
}
