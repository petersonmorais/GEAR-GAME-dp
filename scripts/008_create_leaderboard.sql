-- Create leaderboard view
create or replace view public.leaderboard as
select 
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.level,
  p.experience,
  count(case when mh.result = 'win' then 1 end) as total_wins,
  count(case when mh.result = 'loss' then 1 end) as total_losses,
  count(mh.id) as total_matches,
  round(
    case 
      when count(mh.id) > 0 
      then (count(case when mh.result = 'win' then 1 end)::numeric / count(mh.id)::numeric) * 100
      else 0 
    end, 
    2
  ) as win_rate
from public.profiles p
left join public.match_history mh on p.id = mh.user_id
group by p.id, p.username, p.display_name, p.avatar_url, p.level, p.experience
order by total_wins desc, win_rate desc;

-- Grant access to authenticated users
grant select on public.leaderboard to authenticated;
