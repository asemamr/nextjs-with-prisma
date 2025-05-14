import { Nav, NavLink } from "@/components/Nav";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
    <Nav>
      <NavLink href="/">Home</NavLink>
      <NavLink href="/products">Products</NavLink>
      <NavLink href="/orders">My Orders</NavLink>
    </Nav>
    <div className="container mx-auto my-8">
      {children}
    </div>
  </>

}