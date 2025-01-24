import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const products = [
  { id: "01", name: "Home Decore Range", popularity: 46, color: "#FEC6A1" },
  { id: "02", name: "Disney Princess Dress", popularity: 17, color: "#4fd1c5" },
  { id: "03", name: "Bathroom Essentials", popularity: 19, color: "#0EA5E9" },
  { id: "04", name: "Apple Smartwatch", popularity: 29, color: "#E879F9" },
];

export function TopProducts() {
  return (
    <Card className="bg-dashboard-navy border-0">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground w-8">{product.id}</span>
              <span className="text-sm flex-1">{product.name}</span>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-dashboard-dark rounded-full h-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${product.popularity}%`,
                      backgroundColor: product.color,
                    }}
                  />
                </div>
                <span className="text-sm font-medium w-12">{product.popularity}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}