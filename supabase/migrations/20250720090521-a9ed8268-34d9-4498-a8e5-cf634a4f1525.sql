
-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM ('top_up', 'withdrawal', 'spending', 'earning', 'refund');

-- Create enum for transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');

-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM ('mtn_momo', 'vodafone_cash', 'airteltigo_money', 'bank_card', 'bank_transfer');

-- Create user wallets table
CREATE TABLE public.user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  balance INTEGER NOT NULL DEFAULT 0, -- balance in pesewas (Ghana's smallest currency unit)
  currency TEXT NOT NULL DEFAULT 'GHS',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create wallet transactions table
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES public.user_wallets(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL, -- amount in pesewas
  status transaction_status DEFAULT 'pending',
  payment_method payment_method,
  paystack_reference TEXT,
  paystack_transaction_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user scores table
CREATE TABLE public.user_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  cribn_score INTEGER NOT NULL DEFAULT 0,
  runner_score INTEGER NOT NULL DEFAULT 0,
  notes_uploaded INTEGER DEFAULT 0,
  questions_answered INTEGER DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  reviews_received INTEGER DEFAULT 0,
  marketplace_listings INTEGER DEFAULT 0,
  errands_completed INTEGER DEFAULT 0,
  completion_rate DECIMAL(5,2) DEFAULT 0.00,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  total_earnings INTEGER DEFAULT 0, -- in pesewas
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create user badges table
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_name)
);

-- Enable RLS on all tables
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_wallets
CREATE POLICY "Users can view their own wallet" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create wallets" ON public.user_wallets
  FOR INSERT WITH CHECK (true);

-- RLS Policies for wallet_transactions
CREATE POLICY "Users can view their own transactions" ON public.wallet_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions" ON public.wallet_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "System can update transactions" ON public.wallet_transactions
  FOR UPDATE WITH CHECK (true);

-- RLS Policies for user_scores
CREATE POLICY "Users can view their own scores" ON public.user_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public scores" ON public.user_scores
  FOR SELECT USING (true);

CREATE POLICY "System can create and update scores" ON public.user_scores
  FOR ALL WITH CHECK (true);

-- RLS Policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public badges" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can create badges" ON public.user_badges
  FOR INSERT WITH CHECK (true);

-- Function to create wallet for new users
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id) VALUES (NEW.id);
  INSERT INTO public.user_scores (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create wallet and scores for new users
CREATE TRIGGER on_auth_user_created_wallet
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    IF NEW.type IN ('top_up', 'earning', 'refund') THEN
      UPDATE public.user_wallets 
      SET balance = balance + NEW.amount, updated_at = now()
      WHERE id = NEW.wallet_id;
    ELSIF NEW.type IN ('spending', 'withdrawal') THEN
      UPDATE public.user_wallets 
      SET balance = balance - NEW.amount, updated_at = now()
      WHERE id = NEW.wallet_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update wallet balance when transaction status changes
CREATE TRIGGER on_transaction_completed
  AFTER UPDATE ON public.wallet_transactions
  FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();

-- Function to calculate Cribn Score
CREATE OR REPLACE FUNCTION calculate_cribn_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  user_data RECORD;
BEGIN
  SELECT * INTO user_data FROM public.user_scores WHERE user_id = user_uuid;
  
  IF user_data IS NOT NULL THEN
    -- Notes uploaded (5 points each)
    score := score + (user_data.notes_uploaded * 5);
    
    -- Questions answered (3 points each)
    score := score + (user_data.questions_answered * 3);
    
    -- Events attended (10 points each)
    score := score + (user_data.events_attended * 10);
    
    -- Reviews received (2 points each)
    score := score + (user_data.reviews_received * 2);
    
    -- Marketplace listings (5 points each)
    score := score + (user_data.marketplace_listings * 5);
    
    -- Bonus for high completion rate
    IF user_data.completion_rate >= 95.0 THEN
      score := score + 50;
    ELSIF user_data.completion_rate >= 85.0 THEN
      score := score + 25;
    END IF;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate Runner Score
CREATE OR REPLACE FUNCTION calculate_runner_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  user_data RECORD;
BEGIN
  SELECT * INTO user_data FROM public.user_scores WHERE user_id = user_uuid;
  
  IF user_data IS NOT NULL THEN
    -- Errands completed (10 points each)
    score := score + (user_data.errands_completed * 10);
    
    -- Completion rate bonus
    score := score + (user_data.completion_rate::INTEGER * 2);
    
    -- Average rating bonus (up to 100 points for 5.0 rating)
    score := score + (user_data.average_rating * 20)::INTEGER;
    
    -- High earner bonus
    IF user_data.total_earnings > 100000 THEN -- 1000 GHS in pesewas
      score := score + 100;
    ELSIF user_data.total_earnings > 50000 THEN -- 500 GHS in pesewas
      score := score + 50;
    END IF;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql;
