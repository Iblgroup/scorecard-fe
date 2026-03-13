import "@chakra-ui/react"

declare module "@chakra-ui/react" {
    interface TableVariantProps {
        variant?: "line" | "outline" | "simple" | "striped" | "primary"
        size?: "sm" | "md" | "lg"
    }
}
