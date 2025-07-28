export function mapErrorMessage(message: string): string {
  if (message.includes("You do not have acquired license")) {
    return "თქვენ არ გაქვთ აქტიური ლიცენზია";
  }

  return "დაფიქსირდა შეცდომა";
}
