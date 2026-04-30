import { FilterIcon, FilterXIcon } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import SearchBar from "../../components/SearchBar";
import { Filter } from "../../components/Filter";
import { GET_ALL_CATEGORY } from "../../sanity/queries/categoriesQueries";
import { FILTER_PRODUCTS_BY_BESTSELLING_QUERY, FILTER_PRODUCTS_BY_NAME_QUERY, FILTER_PRODUCTS_BY_PRICE_ASC_QUERY, FILTER_PRODUCTS_BY_PRICE_DESC_QUERY, SEARCH_PRODUCTS_QUERY } from "../../sanity/queries/products_query";
import { sanityFetch } from "../../sanity/sanityFetch";
import TopNavbar from "../../components/layout/TopNavbar";




interface PageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        color?: string;
        material?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
        inStock?: string;
    }>;
}



export default async function SocksPage({ searchParams }: PageProps) {

    const params = await searchParams;

    const searchQuery = params.q ?? "";
    const categorySlug = params.category ?? "";
    const color = params.color ?? "";
    const material = params.material ?? "";
    const minPrice = Number(params.minPrice) || 0;
    const maxPrice = Number(params.maxPrice) || 0;
    const sort = params.sort ?? "name";
    const inStock = params.inStock === "true";


    const getQuery = () => {
        if (searchQuery) {
            return SEARCH_PRODUCTS_QUERY;
        }

        switch (sort) {
            case "price_asc":
                return FILTER_PRODUCTS_BY_PRICE_ASC_QUERY;
            case "price_desc":
                return FILTER_PRODUCTS_BY_PRICE_DESC_QUERY;
            case "relevance":
                return FILTER_PRODUCTS_BY_BESTSELLING_QUERY;
            default:
                return FILTER_PRODUCTS_BY_NAME_QUERY;
        }
    };

    const { data: categories } = await sanityFetch<any[]>({
        query: GET_ALL_CATEGORY
    })

    const { data: products } = await sanityFetch<any[]>({
        query: getQuery(),
        params: {
            query: searchQuery ? `${searchQuery}*` : "",
            categorySlug,
            color,
            material,
            minPrice,
            maxPrice,
            inStock,
        },
    });

    const productlength = products?.length



    return (
        <>
            <TopNavbar />
            <div className="min-h-screen bg-[#fbfbf2] p-4 md:p-8">
                <div className="flex flex-col items-start justify-start gap-2 pb-10">
                    <div className="flex w-full gap-2 items-center ">
                        <SearchBar />
                        <Filter categories={categories} />
                    </div>
                    <h1 className="text-xl md:text-2xl font-luckiest text-black uppercase tracking-tight">
                        {productlength} So🧦ks Found !
                    </h1>
                </div>


                <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-8 w-full max-w-[1400px] mx-auto">
                    {products?.map((product: any, index: number) => (
                        <div
                            key={product._id}
                            className="break-inside-avoid mb-6 md:mb-8 inline-block w-full"
                        >
                            <ProductCard
                                product={{
                                    id: product._id,
                                    slug: product.slug?.current,
                                    name: product.name,
                                    price: product.sale_price || product.price,
                                    images: [product.thumbnailUrl || ''],
                                    badge: "HOT"
                                }}
                            />
                        </div>
                    ))}
                </div>

                {(!products || products.length === 0) && (
                    <div className="text-center py-20">
                        <p className="text-2xl font-pixel uppercase opacity-50">No 🧦 found 😩 matching your 🔍</p>
                    </div>
                )}
            </div>
        </>


    );
}