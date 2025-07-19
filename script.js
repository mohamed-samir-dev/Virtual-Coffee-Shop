  class CoffeeShopAgent {
            constructor() {
                this.menu = {
                    coffee: {
                        espresso: { price: 2.50, description: "قوي وجريء", arabicName: "إسبريسو" },
                        americano: { price: 3.00, description: "ناعم وكلاسيكي", arabicName: "أمريكانو" },
                        latte: { price: 4.00, description: "كريمي ومعتدل", arabicName: "لاتيه" },
                        cappuccino: { price: 3.75, description: "رغوي ومتوازن", arabicName: "كابتشينو" },
                        mocha: { price: 4.50, description: "لذة الشوكولاتة", arabicName: "موكا" },
                        macchiato: { price: 4.25, description: "حلاوة الكراميل", arabicName: "ماكياتو" }
                    },
                    tea: {
                        green_tea: { price: 2.25, description: "خفيف ومنعش", arabicName: "شاي أخضر" },
                        black_tea: { price: 2.25, description: "قوي ومنشط", arabicName: "شاي أسود" },
                        herbal_tea: { price: 2.50, description: "مهدئ وخالي من الكافيين", arabicName: "شاي عشبي" }
                    },
                    cold_drinks: {
                        iced_coffee: { price: 3.25, description: "قهوة باردة منعشة", arabicName: "قهوة مثلجة" },
                        frappuccino: { price: 4.75, description: "مشروب قهوة مثلج مخلوط", arabicName: "فرابتشينو" },
                        iced_tea: { price: 2.75, description: "بارد ومنعش", arabicName: "شاي مثلج" }
                    }
                };
                this.sweetnessLevels = {
                    "بدون سكر": "no sugar",
                    "خفيف": "light", 
                    "متوسط": "medium",
                    "حلو": "sweet",
                    "حلو جداً": "extra sweet"
                };
                this.coffeeStrengths = {
                    "خفيف": "mild",
                    "متوسط": "medium", 
                    "قوي": "strong",
                    "قوي جداً": "extra strong"
                };
                this.sizes = { 
                    "صغير": 0, 
                    "متوسط": 0.50, 
                    "كبير": 1.00 
                };
                this.currentOrder = {};
                this.conversationState = "taking_order";
                this.ordersHistory = [];
            }

            processOrder(userInput) {
                const input = userInput.trim();
                
                // Check for menu request
                if (input.includes('قائمة') || input.includes('أظهر') || input.includes('اعرض')) {
                    return this.showFullMenu();
                }
                
                // Check for recommendations
                if (input.includes('اقترح') || input.includes('نصح') || input.includes('ماذا') || input.includes('مشهور')) {
                    return this.recommendDrink(input);
                }
                
                // Handle ordering flow
                if (this.conversationState === "taking_order") {
                    const selectedDrink = this.identifyDrink(input);
                    if (selectedDrink) {
                        this.currentOrder.drink = selectedDrink;
                        this.conversationState = "customizing";
                        return this.askCustomizationQuestions(selectedDrink);
                    } else {
                        return "لم أفهم طلبك.من فضلك، اكتب الرسالة بنفس الصيغة الظاهرة في الاقتراحات ليتعرف عليها المساعد بشكل صحيح";
                    }
                } else if (this.conversationState === "customizing") {
                    return this.handleCustomization(input);
                }
                
                return "أنا هنا لمساعدتك في الطلب! أي مشروب تريد اليوم؟";
            }

            showFullMenu() {
                let menuHtml = '<div class="menu-display"><strong>📋 القائمة الكاملة</strong><br><br>';
                
                const categoryNames = {
                    coffee: "القهوة",
                    tea: "الشاي", 
                    cold_drinks: "المشروبات الباردة"
                };
                
                for (const [category, items] of Object.entries(this.menu)) {
                    menuHtml += `<strong>${categoryNames[category]}:</strong><br>`;
                    for (const [drink, info] of Object.entries(items)) {
                        menuHtml += `• ${info.arabicName} - ${info.price.toFixed(2)}$ - ${info.description}<br>`;
                    }
                    menuHtml += '<br>';
                }
                menuHtml += 'ماذا تود أن تجرب؟</div>';
                return menuHtml;
            }

            recommendDrink(preferences) {
                let recommendations = [];
                
                if (preferences.includes('قوي') || preferences.includes('جريء')) {
                    recommendations = ['espresso', 'americano'];
                } else if (preferences.includes('حلو') || preferences.includes('حلا')) {
                    recommendations = ['mocha', 'macchiato'];
                } else if (preferences.includes('خفيف') || preferences.includes('كريم')) {
                    recommendations = ['latte', 'cappuccino'];
                } else if (preferences.includes('بارد') || preferences.includes('مثلج')) {
                    recommendations = ['iced_coffee', 'frappuccino'];
                } else if (preferences.includes('شاي')) {
                    recommendations = ['green_tea', 'black_tea'];
                } else {
                    recommendations = ['latte', 'cappuccino', 'americano'];
                }
                
                let response = "بناءً على تفضيلاتك، أنصحك بـ:<br><br>";
                for (const drink of recommendations.slice(0, 3)) {
                    for (const [category, items] of Object.entries(this.menu)) {
                        if (items[drink]) {
                            const info = items[drink];
                            response += `☕ <strong>${info.arabicName}</strong> - ${info.price.toFixed(2)}$<br>`;
                            response += `&nbsp;&nbsp;&nbsp;${info.description}<br><br>`;
                            break;
                        }
                    }
                }
                response += "أيهم يبدو جيداً لك؟";
                return response;
            }

            identifyDrink(input) {
                for (const [category, drinks] of Object.entries(this.menu)) {
                    for (const [drinkName, info] of Object.entries(drinks)) {
                        if (input.includes(info.arabicName) || 
                            input.includes(drinkName.replace('_', ' ')) ||
                            input.includes(drinkName.replace('_', ''))) {
                            return drinkName;
                        }
                    }
                }
                return null;
            }

                      askCustomizationQuestions(drink) {
                const questions = [];
                const drinkInfo = this.getDrinkInfo(drink);
                
                // Coffee strength for coffee drinks
                const coffeeDrinks = ['latte', 'cappuccino', 'americano', 'mocha', 'macchiato', 'espresso'];
                if (coffeeDrinks.includes(drink)) {
                    questions.push("كيف تريد قوة القهوة؟ (خفيف/متوسط/قوي/قوي جداً)");
                }
                
                // Sweetness for most drinks
                if (!drink.includes('tea') || drink.includes('herbal')) {
                    questions.push("كم تريد الحلاوة؟ (بدون سكر/خفيف/متوسط/حلو/حلو جداً)");
                }
                
                // Size
                questions.push("أي حجم تفضل؟ (صغير/متوسط/كبير)");
                
                let response = `اختيار ممتاز! دعني أخصص لك ${drinkInfo.arabicName}:<br><br>`;
                questions.forEach(q => response += `• ${q}<br>`);
                response += "<br>يمكنك الإجابة على كل سؤال أو إخباري بكل التفضيلات مرة واحدة.";
                return response;
            }

            handleCustomization(input) {
                // Extract preferences for sweetness
                for (const [arabicSweet, englishSweet] of Object.entries(this.sweetnessLevels)) {
                    if (input.includes(arabicSweet)) {
                        this.currentOrder.sweetness = arabicSweet;
                        break;
                    }
                }
                
                // Extract preferences for coffee strength
                for (const [arabicStrength, englishStrength] of Object.entries(this.coffeeStrengths)) {
                    if (input.includes(arabicStrength)) {
                        this.currentOrder.strength = arabicStrength;
                        break;
                    }
                }
                
                // Extract size preferences
                for (const arabicSize of Object.keys(this.sizes)) {
                    if (input.includes(arabicSize)) {
                        this.currentOrder.size = arabicSize;
                        break;
                    }
                }
                
                // Check if we have required info
                if (this.currentOrder.drink && this.currentOrder.size) {
                    return this.confirmOrder();
                } else {
                    const missing = [];
                    if (!this.currentOrder.size) missing.push("الحجم (صغير/متوسط/كبير)");
                    return `ما زلت بحاجة لمعرفة ${missing.join(' و ')}. هل يمكنك إخباري؟`;
                }
            }

            confirmOrder() {
                const drink = this.currentOrder.drink;
                const size = this.currentOrder.size || "متوسط";
                const strength = this.currentOrder.strength || "";
                const sweetness = this.currentOrder.sweetness || "";
                
                // Calculate price
                const drinkInfo = this.getDrinkInfo(drink);
                const basePrice = drinkInfo.price;
                const totalPrice = basePrice + this.sizes[size];
                
                // Create confirmation
                let confirmation = `<div style="background: #e8f5e8; padding: 15px; border-radius: 10px; border-right: 4px solid #4caf50;">`;
                confirmation += `<strong>🧾 تأكيد الطلب</strong><br><br>`;
                confirmation += `<strong>المشروب:</strong> ${drinkInfo.arabicName}<br>`;
                confirmation += `<strong>الحجم:</strong> ${size}<br>`;
                if (strength) confirmation += `<strong>القوة:</strong> ${strength}<br>`;
                if (sweetness) confirmation += `<strong>الحلاوة:</strong> ${sweetness}<br>`;
                confirmation += `<br><strong>💰 المجموع: ${totalPrice.toFixed(2)}$</strong><br><br>`;
                confirmation += `تم تسجيل طلبك! ✅<br>`;
                confirmation += `الوقت المتوقع للتحضير: 5-7 دقائق<br><br>`;
                confirmation += `شكراً لاختيارك المقهى الافتراضي!<br>`;
                confirmation += `هل تريد طلب شيء آخر؟</div>`;
                
                // Save order
                this.ordersHistory.push({
                    timestamp: new Date().toISOString(),
                    order: { ...this.currentOrder },
                    totalPrice: totalPrice
                });
                
                // Reset for next order
                this.currentOrder = {};
                this.conversationState = "taking_order";
                
                return confirmation;
            }

            getDrinkInfo(drinkName) {
                for (const [category, drinks] of Object.entries(this.menu)) {
                    if (drinks[drinkName]) {
                        return drinks[drinkName];
                    }
                }
                return null;
            }
        }

        // Initialize the agent
        const agent = new CoffeeShopAgent();

        function addMessage(message, isUser = false) {
            const chatContainer = document.getElementById('chatContainer');
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${isUser ? 'user-message' : 'agent-message'}`;
            
            if (isUser) {
                messageDiv.innerHTML = `<strong>أنت:</strong> ${message}`;
            } else {
                messageDiv.innerHTML = `<strong>الباريستا الذكي:</strong> ${message}`;
            }
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            
            if (message) {
                addMessage(message, true);
                
                // Get response from agent
                const response = agent.processOrder(message);
                
                // Add agent response after a short delay
                setTimeout(() => {
                    addMessage(response);
                }, 500);
                
                input.value = '';
            }
        }

        function quickMessage(message) {
            document.getElementById('userInput').value = message;
            sendMessage();
        }

        function handleKeyPress(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        }

        // Focus on input when page loads
        window.onload = function () {
            document.getElementById('userInput').focus();
        };