export function mapErrorMessage(message: string): string {
  if (message.includes("You do not have acquired license")) {
    return "თქვენ არ გაქვთ აქტიური ლიცენზია";
  }

  if (message.includes("License not found")) {
    return "ლიცენზია ვერ მოიძებნა";
  }

  return "დაფიქსირდა შეცდომა";
}
