import razorpay
client = razorpay.Client(auth=("rzp_test_0DqsVb6cb8KC42", "vF673B83IfEdp4UzNkcpp7Se"))

client.set_app_details({"title" : "ShopKart", "version" : "1.1.0"})